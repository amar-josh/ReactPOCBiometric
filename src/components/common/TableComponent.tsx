import translator from "@/i18n/translator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface IHeaderConfig {
  label: string;
  key: string;
}

interface ITableComponentProps {
  headers: IHeaderConfig[];
  data: Array<Record<string, string>>;
}

const TableComponent = ({ headers, data }: ITableComponentProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead
                key={header.key}
                className="text-center text-primary-gray"
              >
                {translator(header.label)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell key={header.key} className="text-center">
                    {row[header.key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length}
                className="text-center text-sm text-gray-400 py-4"
              >
                {translator("noRecordsFound")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
