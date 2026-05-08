const xlsx = require('xlsx');
const mongoose = require('mongoose');

const importData = async (Model, req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.files.file;
    const workbook = xlsx.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, message: 'Empty or invalid Excel file' });
    }

    const headerMap = {
      'nombre': 'name',
      'telefono': 'phone',
      'teléfono': 'phone',
      'pais': 'country',
      'país': 'country',
      'direccion': 'address',
      'dirección': 'address',
      'email': 'email',
      'correo': 'email',
      'descripcion': 'description',
      'descripción': 'description',
      'simbolo': 'symbol',
      'símbolo': 'symbol',
      'tipo de recurso': 'resourceType',
      'unidad de medida': 'unitOfMeasurement',
      'precio unitario': 'unitPrice',
      'fecha de cotizacion': 'quoteDate',
      'fecha de cotización': 'quoteDate',
      'fecha': 'date',
      'recurso': 'resource',
      'moneda': 'currency',
      'proveedor': 'provider',
      'fecha de vencimiento': 'expiredDate',
      'estado': 'status',
      'nota': 'note',
      'tasa de impuesto': 'taxRate',
      'subtotal': 'subTotal',
      'impuestos': 'taxTotal',
      'total': 'total',
      'cliente': 'client',
      'identificador': 'identifier',
    };

    const transformedData = data.map(row => {
      const newRow = {};
      for (const key in row) {
        const lowerKey = key.trim().toLowerCase();
        const mappedKey = headerMap[lowerKey] || key.trim();
        newRow[mappedKey] = row[key];
      }
      return newRow;
    });

    const importedItems = [];
    const errors = [];
    
    const schemaPaths = Model.schema.paths;
    const refPaths = Object.keys(schemaPaths).filter(
      (path) => schemaPaths[path].instance === 'ObjectID' && schemaPaths[path].options.ref
    );

    for (let index = 0; index < transformedData.length; index++) {
      const row = transformedData[index];
      try {
        const itemData = { ...row };

        // Resolve dependencies
        for (const refPath of refPaths) {
          if (itemData[refPath]) {
            const refModelName = schemaPaths[refPath].options.ref;
            if (refModelName === 'Admin') {
                itemData[refPath] = req.admin ? req.admin._id : null;
                continue;
            }

            const RefModel = mongoose.model(refModelName);
            const refValue = String(itemData[refPath]).trim();
            
            if (mongoose.Types.ObjectId.isValid(refValue) && String(new mongoose.Types.ObjectId(refValue)) === refValue) {
                itemData[refPath] = new mongoose.Types.ObjectId(refValue);
            } else {
                const searchCriteria = [];
                if (RefModel.schema.paths['name']) searchCriteria.push({ name: { $regex: new RegExp(`^${refValue}$`, 'i') } });
                if (RefModel.schema.paths['identifier']) searchCriteria.push({ identifier: refValue });
                if (RefModel.schema.paths['symbol']) searchCriteria.push({ symbol: { $regex: new RegExp(`^${refValue}$`, 'i') } });
                
                if (searchCriteria.length === 0) {
                   throw new Error(`Cannot resolve dependency ${refPath} for value "${refValue}" - model ${refModelName} lacks name/identifier/symbol`);
                }

                const relatedItem = await RefModel.findOne({ $or: searchCriteria });
                if (!relatedItem) {
                  throw new Error(`Dependency not found: ${refPath} ('${refValue}') in ${refModelName}`);
                }
                itemData[refPath] = relatedItem._id;
            }
          }
        }

        // Apply user fallback property if creating user tracking is required
        if (schemaPaths['created_by']) {
            itemData.created_by = req.admin ? req.admin._id : itemData.created_by;
        }

        // Validate and insert
        const newItem = new Model(itemData);
        await newItem.validate();
        
        let savedItem;
        if (typeof newItem.save === 'function') {
           savedItem = await newItem.save();
        } else {
           savedItem = await Model.create(itemData);
        }

        importedItems.push(savedItem._id);
      } catch (err) {
        errors.push({
          row: index + 2,
          data: row,
          reason: err.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      result: {
        importedCount: importedItems.length,
        errors,
      },
      message: `Successfully imported ${importedItems.length} records. ${errors.length > 0 ? `Failed for ${errors.length} rows.` : ''}`
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error during import', error: error.message });
  }
};

module.exports = importData;
