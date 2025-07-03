import { useAuthStore } from "@/stores/authStore";
import { listEntity } from "@/utils/connections";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useListEntity<T>(entity: string, page: number) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listData, setListData] = useState<T[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const refreshData = () => {
    fetchData();
  };

  const { user } = useAuthStore();

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsSuccess(false);

    if (!user) {
      setIsLoading(false);
      return;
    }

    const res = await listEntity(entity, page, 10, user.token);

    if (!res.data.success) {
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    setListData(await res.data.result);
    setIsLoading(false);
    setIsSuccess(true);

    if (listData.length === 0 && page > 1) {
      navigate(`/${entity}/list/1`);
    }
  }, [entity, listData.length, navigate, page, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [listData, isLoading, isSuccess, refreshData] as const;
}
