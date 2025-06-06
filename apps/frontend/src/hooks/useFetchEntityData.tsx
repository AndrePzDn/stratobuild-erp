import { useAuthStore } from "@/stores/authStore";
import { listAllEntity, readEntity } from "@/utils/connections";
import { useCallback, useEffect, useState } from "react";

export default function useFetchData<T>(entity: string, id?: string) {
  const [data, setData] = useState<T[]>([]);
  const { user } = useAuthStore();

  const fetchData = useCallback(async () => {
    if (!user) return;

    let res;
    if (!id) {
      res = await listAllEntity(entity, user.token);
    } else {
      res = await readEntity(entity, id, user.token);
    }

    console.log(res.data);
    setData(await res.data.result);
  }, [entity, id, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, refetch: fetchData };
}
