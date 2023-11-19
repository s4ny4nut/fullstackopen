import StatisticLine from "./StatisticLine";

function Statistics({good, neutral, bad}) {
    const all = good + neutral + bad;
    const average = (((1 * good) + (bad * (-1))) / all).toFixed(1);
    const positive = (good * 100 / all).toFixed(1);

    if(!good & !neutral & !bad) {
        return (
            <>
                <h2>Statistics</h2>
                <p>No feedback given</p>
            </>
        )
    }

    return (
        <>
            <h2>Statistics</h2>
            <table>
                <tbody>
                    <StatisticLine text='good' value={good}/>
                    <StatisticLine text='neutral' value={neutral}/>
                    <StatisticLine text='bad' value={bad}/>
                    <StatisticLine text='all' value={all}/>
                    <StatisticLine text='average' value={average}/>
                    <StatisticLine text='positive' value={positive}/>
                </tbody>
            </table>

        </>
    )
}

export default Statistics;