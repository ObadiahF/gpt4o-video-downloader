/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DataCard from "./DataCard";

interface DataListProps {
  items: any[];
  showStatus?: boolean;
  onDelete?: (id: string, deleteFile: boolean) => void;
}

const DataList: React.FC<DataListProps> = ({
  items,
  showStatus = true,
  onDelete,
}) => {
  return (
    <ul className="list-group">
      {items.map((item) => (
        <DataCard
          key={item.id}
          item={item}
          showStatus={showStatus}
          onDelete={onDelete}
          onCancel={onDelete}
        />
      ))}
    </ul>
  );
};

export default DataList;
