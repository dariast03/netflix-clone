import styles from "@/assets/styles/Select.module.css";
import { BlobOptions } from "buffer";
import { TbWorld } from "react-icons/tb";

interface Props {
  register?: boolean;
  login?: boolean;
}

export const Select = ({ register, login }: Props) => {
  return (
    <div className={styles.select_container}>
      <select
        className={styles.select}
        style={{
          color: register ? "#000" : "",
          backgroundColor: login ? "black" : "",
        }}
      >
        <option value="es">Espanol</option>
        <option value="en">Ingles</option>
      </select>

      <TbWorld size={15} color={register ? "000" : "FFF"} />
    </div>
  );
};
