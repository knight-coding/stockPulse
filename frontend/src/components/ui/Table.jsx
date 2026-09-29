export default function Table({
    columns,
    data,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border">

            <table className="w-full">

                <thead className="bg-hover">

                    <tr>

                        {columns.map((column) => (

                            <th
                                key={column.key}
                                className="px-5 py-3 text-left text-sm font-semibold text-foreground"
                            >
                                {column.title}
                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {data.map((row, index) => (

                        <tr
                            key={index}
                            className="border-t border-border hover:bg-hover transition"
                        >

                            {columns.map((column) => (

                                <td
                                    key={column.key}
                                    className="px-5 py-4 text-sm text-foreground"
                                >
                                    {row[column.key]}
                                </td>

                            ))}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}