function StatisticLine({text, value}) {
    return (
        <tr>
            <td>
                {text} 
            </td>
            <td>
                {value} {text === 'positive' ? '%' : null}
            </td>
        </tr>
    )
}

export default StatisticLine;