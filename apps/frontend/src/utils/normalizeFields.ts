export const normalizeItemToEdit = (item: any, fieldsToNormalize: string[] = []) => {
  if (!item) return item;

  const normalized = { ...item };

  fieldsToNormalize.forEach((field) => {
    const parts = field.split(".");
    if (parts.length === 1) {
      // Nivel 1
      const value = item[field];
      if (value && typeof value === "object" && value._id) {
        normalized[field] = value._id;
      }
    } else if (parts.length === 2) {
      const [parentKey, childKey] = parts;
      const parentValue = item[parentKey];

      if (Array.isArray(parentValue)) {
        normalized[parentKey] = parentValue.map((entry: any) => {
          if (entry[childKey] && typeof entry[childKey] === "object" && entry[childKey]._id) {
            return {
              ...entry,
              [childKey]: entry[childKey]._id,
            };
          }
          return entry;
        });
      }
    }
  });

  return normalized;
};

