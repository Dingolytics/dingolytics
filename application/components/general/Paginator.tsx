import React from "react";
import Pagination from "antd/lib/pagination";

interface PaginatorProps {
  page: number;
  showPageSizeSelect?: boolean;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  totalCount: number;
  onChange?: (page: number, pageSize: number | undefined) => void;
}

const MIN_ITEMS_PER_PAGE = 5;

const PAGE_SIZE_OPTIONS = ["5", "10", "20", "50", "100"];

export default function Paginator({
  page,
  showPageSizeSelect,
  pageSize,
  onPageSizeChange,
  totalCount,
  onChange,
}: PaginatorProps) {
  if (totalCount <= (showPageSizeSelect ? MIN_ITEMS_PER_PAGE : pageSize)) {
    return null;
  }
  return (
    <div className="paginator-container">
      <Pagination
        showSizeChanger={showPageSizeSelect}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        defaultCurrent={page}
        pageSize={pageSize}
        total={totalCount}
        onChange={
          (newPage, pageSize) => onChange && onChange(newPage, pageSize)
        }
        onShowSizeChange={
          (_, size) => onPageSizeChange && onPageSizeChange(size)
        }
      />
    </div>
  );
}
