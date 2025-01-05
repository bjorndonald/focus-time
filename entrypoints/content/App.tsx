import { useEffect, useState } from "react";
import moment from 'moment'
import { cx } from 'react-twc'
import "./../../assets/style.css";

interface TimeData {
    [key: string]: number
}

export default () => {
    const [count, setCount] = useState(1);
    const [tick, setTick] = useState(moment());
    const [target] = useState(moment().add(5, 'minutes'));

    useEffect(() => {
        // var time = 7200;
        // var duration = moment.duration(time * 1000, 'milliseconds');
        // var interval = 1000;
        // const timing = setInterval(() => {
        //     duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
        //     const hours = document.getElementById("hours") as HTMLHeadingElement
        //     const minutes = document.getElementById("minutes") as HTMLHeadingElement
        //     const seconds = document.getElementById("seconds") as HTMLHeadingElement
        //     if (!hours && !minutes && !seconds) return
        //     hours.innerText = duration.hours() < 10 ? "0" + duration.hours().toFixed(0) + "" : duration.hours().toFixed(0) + ""
        //     minutes.innerText = duration.minutes() < 10 ? "0" + duration.minutes().toFixed(0) + "" : duration.minutes().toFixed(0) + ""
        //     seconds.innerText = duration.seconds() < 10 ? "0" + duration.seconds().toFixed(0) + "" : duration.seconds().toFixed(0) + ""
        // }, interval)
        
         

        return () => {
            // clearTimeout(timing);
        }
    }, [])

    return (
        <div style={{
            display: "grid",
            position: "relative",
            zIndex: "99999999999999",
            borderRadius: "10px",
            gap: "2.5px",
            backgroundColor: "rgba(127,21,21,0.35)",
            marginLeft: "auto",
            width: "fit-content",
            padding: "30px",
            backdropFilter: "blur(10px)",
            justifyContent: "center",
            gridTemplateColumns: "repeat(5, min-content)",
        }}>
            <div style={{
                display: "flex",
                gap: "5px",
                flexDirection: "column",
            }} className="flex gap-[5px] flex-col">
                <h3 style={{
                    fontSize: "38px",
                    lineHeight: "120%",
                    fontWeight: "700",
                    fontFamily: '"Space Mono", sans-serif',
                }} id='hours'></h3>
            </div>
            <h4 style={{
                fontSize: "28px",
                lineHeight: "140%",
                fontWeight: "700",
                fontFamily: '"Space Mono", sans-serif',
            }}>
                :
            </h4>
            <div style={{
                display: "flex",
                gap: "5px",
                flexDirection: "column",
            }} className="flex gap-[5px] flex-col">
                <h3 style={{
                    fontSize: "38px",
                    lineHeight: "120%",
                    fontWeight: "700",
                    fontFamily: '"Space Mono", sans-serif',
                }} id='minutes'></h3>

            </div>
            <h4 style={{
                fontSize: "28px",
                lineHeight: "140%",
                fontWeight: "700",
                fontFamily: '"Space Mono", sans-serif',
            }}>
                :
            </h4>
            <div style={{
                display: "flex",
                gap: "5px",
                flexDirection: "column",
            }} className="flex gap-[5px] flex-col">
                <h3 style={{
                    fontSize: "38px",
                    lineHeight: "120%",
                    fontWeight: "700",
                    fontFamily: '"Space Mono", sans-serif',
                }} id='seconds'></h3>

            </div>

        </div>

    );
};