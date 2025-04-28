import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Select from 'react-select';
import { usePagination, DOTS } from './usePagination';

const Pagination = ({ onPageChange,totalCount,currentPage,pageSize,siblingCount = 1, perPage }) => {

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });

    const total = Math.ceil(totalCount/pageSize);

    const options = [
        { value: '10', label: '10' },
        { value: '15', label: '15' },
        { value: '20', label: '20' }
    ];

    
    const onNext = () => {
        onPageChange(currentPage + 1);
    };
    
    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };
    
    let lastPage = paginationRange[paginationRange.length - 1];
    
    useEffect(() => {
        if(currentPage>paginationRange.length && currentPage!=1 && total!=0){
            onPageChange(total);
        }
    },[total])
    
    if (currentPage === 0 || paginationRange.length < 1) {
        return null;
    }
    
    return (
        <div className="d-flex justify-content-end">
            <Select
                className=""
                classNamePrefix="select"
                defaultValue={options[0]}
                name="itemNumber"
                options={options}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: '0.375rem'
                })}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: '#dee2e6',
                    }),
                }}
                onChange={(e) => perPage(parseInt(e.value))}
            />

            <nav aria-label="Page navigation example">
                <ul className="pagination ms-2">
                    <li className={classNames("page-item",{disabled: currentPage === 1})}>
                        <button type="button" onClick={onPrevious} className="page-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {paginationRange.map((pageNumber,index) => {
                        if (pageNumber === DOTS) {
                        return <li key={index} className="page-item"><div className="page-link">&#8230;</div></li>;
                        }

                        return (
                        <li key={index} className={classNames('page-item', {active: currentPage == pageNumber})}>
                            <button type="button" onClick={() => onPageChange(pageNumber)} className="page-link">{pageNumber}</button>
                        </li>
                        );
                    })}
                    <li className={classNames("page-item",{disabled: currentPage === lastPage})}>
                        <button type="button" onClick={onNext} className="page-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )

};

export default Pagination;