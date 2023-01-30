import React from 'react'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid';

const MAX_BREAKPOINTS = 20

export default function Looper() {
    var ref = React.createRef(null)

    const [url, setUrl] = useState('https://www.youtube.com/watch?v=08nggMRgCFI')
    const [inputUrl, setInputUrl] = useState('')
    const [breakpoints, setBreakpoints] = useState([])
    const [player, setPlayer] = useState(null)
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    var capture = e => {
        if (breakpoints.length > MAX_BREAKPOINTS) {
            alert(`Cannot create more than ${MAX_BREAKPOINTS} breakpoints`)
            return
        }
        const time = player.getCurrentTime()
        const id = uuid()
        const breakpoint = {
            id: id,
            time: time,
        }
        setBreakpoints(prev => [...prev, breakpoint])
    }

    ref = reactPlayer => {
        setPlayer(reactPlayer)
    }

    var playFrom = time => {
        return (e) => {
            player.seekTo(time)
            player.playing = true
        }
    }

    var remove = id => {
        return (e) => {
            const updated = breakpoints.filter((item) => item.id !== id)
            setBreakpoints(updated)
        }
    }

    var clear = e => {
        setBreakpoints([])
    }

    var msToTime = milliseconds => {
        if (milliseconds == 0) {
            return '00:00.000'
        }
        if (milliseconds < 1000) {
            return `00:00.${milliseconds}`
        }
        const seconds = Math.floor(milliseconds / 1000)
        if (seconds < 60) {
            if (seconds < 10) {
                return `00:0${seconds}.${milliseconds-seconds*1000}`
            }
            return `00:${seconds}.${milliseconds-seconds*1000}`
        }
        const minutes = Math.floor(seconds / 60)
        if (minutes < 10) {
            return `0${minutes}:${seconds-minutes*60}.${milliseconds-seconds*1000}`    
        }
        return `${minutes}:${seconds}.${milliseconds-seconds*1000}`
    }

    var loadUrl = e => {
        setUrl(inputUrl)
    }

    var handleInputUrl = (e) => setInputUrl(e.target.value)

  return (
    <main className="space-y-12 mx-4 md:mx-24 flex flex-row">
      <section className="mx-8 px-4 border-r-2">
        <div className="flex my-4">
            <input
            className="w-full my-3 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            type="text"
            placeholder="Paste YouTube URL, example: https://www.youtube.com/watch?v=08nggMRgCFI"
            onChange={handleInputUrl}
            />
            <button
            className="rounded my-3 px-4 bg-transparent border border-blue-500"
            onClick={loadUrl}>
                load
            </button>
        </div>
        <div>
        {domLoaded && (
            <ReactPlayer
            url={url}
            ref={ref}
            width='600px'
            height='400px'
            controls={true}
            playing={true}
            loop={true}
            config={{
                youtube: {
                  playerVars: { autoplay: 1 }
                },
              }}
            />
        )}
      </div>
      </section>
      <section className="mx-8 px-8">
        <section>
            <div>
                <p className="text-xl py-2">Manual</p>
                <ol className="list-decimal">
                    {
                        [
                            'Play the video',
                            'Click "capture" to add new breakpoint',
                            'Click "play" to start the video from selected breakpoint',
                            'Click "remove" to delete breakpoint or "clear" to delete all breakpoints'
                        ].map(text => (
                            <li className="py-1">
                                {text}
                            </li>
                        ))
                    }
                </ol>
            </div>
            <button
                className="rounded ml-4 py-2 px-4 bg-transparent border border-blue-500"
                onClick={capture}>
                capture
            </button>
            <button
                className="rounded ml-4 py-2 px-4 bg-transparent border border-grey-900"
                onClick={clear}>
                clear
            </button>
        </section>
        <hr className="my-7"></hr>
        <section className="mx-8 px-8">
        {breakpoints.map(breakpoint => {
            const time = msToTime(Math.floor(breakpoint.time * 1000));
            return (
                <div key={breakpoint.id} className="flex mx-4 py-2">
                    <input
                        type="text"
                        placeholder="breakpoint name..."
                        className="font-light text-gray-400 py-2 px-4 border border-blue-300"
                    />
                    <p className="font-light text-gray-400 py-2 px-4">{time}</p>
                    <button
                        className="rounded py-2 px-4 bg-transparent border border-blue-500"
                        onClick={playFrom(breakpoint.time)}>
                        play
                    </button>
                    <button
                        className="rounded py-2 px-4 bg-transparent border border-red-500"
                        onClick={remove(breakpoint.id)}>
                        remove
                    </button>
                </div>
            )
        })}
      </section>
      </section>
    </main>
  )
}
