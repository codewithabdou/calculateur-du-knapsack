import React from "react";
import { Audio } from "react-loader-spinner";

const ResultArea = ({ result }) => {
  return (
    <div className="p-[5%] space-y-8">
      {result ? (
        <>
          <h1 className="text-3xl font-bold">
            La valeur maximale : {result.maxValue}
          </h1>
          <h1 className="text-3xl font-bold">
            Les objets choisis :{" "}
            {result.selectedObjects.length
              ? result.selectedObjects.map(
                  (object, index) =>
                    `${object + 1} ${
                      index === result.selectedObjects.length - 1 ? "" : " , "
                    }`
                )
              : "Aucun objet choisi"}
          </h1>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResultArea;
