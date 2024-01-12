import SliderUI from "@/lib/slider/slider";

import styles from "./sideMenu.module.css";
import React from "react"

const SideMenu = (props) => {
  

  return (
    <>
      <div className={styles.divSideMenu}>
        <div className={styles.colorSlider}>
          <SliderUI length={300}/>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
