import { DataTable } from '~/components/ui/data-table/data-table'
import { columns, type Project } from './columns'

interface ProjectListTableProps {
	data: Project[]
}

export function ProjectListTable({ data }: ProjectListTableProps) {
	return <DataTable columns={columns} data={data} />
}
