import React, { useState, useEffect, useContext } from "react";

const Table = (props) => {
    const { list: values, headers, renderers, hasActions, TableDropdown, hasNumber, currentPage, itemsPerPage } = props;

    return (
        <table className="table">
            <colgroup>
                {headers.map((e, i) => <col key={i} style={{ width: e.width }} />)}
            </colgroup>
            <thead style={{ borderBottom: "3px solid" }}>
                <tr className="text-center">
                    {hasNumber && (
                        <th scope="col">Nro.</th>
                    )}
                    {headers.map((col) => (
                        <th scope="col" key={col.key}>{col.label || col.key}</th>
                    ))}
                    {hasActions && (
                        <th scope="col">Acciones</th>
                    )}
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {values.map((row, i) => (
                    <tr key={i} className="text-center">
                        {hasNumber && (
                            <th scope="row">{(itemsPerPage * (currentPage - 1)) + (i + 1)}</th>
                        )}
                        {headers.map((col) => (
                            <td key={col.key}>
                                {renderers[col.key]?.render
                                    ? renderers[col.key].render(row[col.key])
                                    : row[col.key]}
                            </td>
                        ))}
                        {hasActions && (
                            <td><TableDropdown elem={row} /></td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;