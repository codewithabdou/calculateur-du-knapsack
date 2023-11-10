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
         <Table data={result.resultTable}/>
              
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResultArea;

const Table = ({ data }) => {
  return (
    <table className="border-collapse border w-full" cellSpacing="0">
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, colIndex) => (
            <td
              key={colIndex}
              className="border p-2 text-center"
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
  );
};
