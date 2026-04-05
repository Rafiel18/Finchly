import { useStorage } from "./useStorage";
import { createInitialData } from "../utils/createInitialData";

export function useUserData(userId) {
  const [dados, setDados] = useStorage(`finchly_data_${userId}`);

  const data = dados || createInitialData();

  const save = (patch) => {
    setDados({
      ...data,
      ...patch,
    });
  };

  const reset = () => {
    setDados(createInitialData());
  };

  return {
    data,
    save,
    reset,
  };
}
