import React from 'react'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid';
import Image from 'next/image';
import { ArrowDownIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/solid'

const MAX_BREAKPOINTS = 20

export default function Looper() {
    var ref = React.createRef()

    const [url, setUrl] = useState('https://www.youtube.com/watch?v=08nggMRgCFI')
    const [inputUrl, setInputUrl] = useState('')
    const [breakpoints, setBreakpoints] = useState([])
    const [player, setPlayer] = useState(null)
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    var capture = (e) => {
        if (player === null) {
            return
        }
        if (breakpoints.length > MAX_BREAKPOINTS-1) {
            alert(`Cannot create more than ${MAX_BREAKPOINTS} breakpoints`)
            return
        }
        const time = player.getCurrentTime()
        const id = uuid()
        const breakpoint = {
            id: id,
            time: time,
        }
        setBreakpoints((prev) => [...prev, breakpoint])
    }

    ref = (reactPlayer) => {
        setPlayer(reactPlayer)
    }

    var playFrom = (time) => {
        return (e) => {
            player.seekTo(time)
            player.playing = true
        }
    }

    var remove = (id) => {
        return (e) => {
            const updated = breakpoints.filter((item) => item.id !== id)
            setBreakpoints(updated)
        }
    }

    var clear = (e) => {
        setBreakpoints([])
    }

    var msToTime = milliseconds => {
        if (milliseconds == 0) {
            return '00:00.000'
        }
        if (milliseconds < 1000) {
            return `00:00.${milliseconds}`
        }
        var seconds = Math.floor(milliseconds / 1000)
        if (seconds < 60) {
            if (seconds < 10) {
                return `00:0${seconds}.${milliseconds-seconds*1000}`
            }
            return `00:${seconds}.${milliseconds-seconds*1000}`
        }
        const minutes = Math.floor(seconds / 60)
        seconds = seconds - minutes*60
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        if (minutes < 10) {
            return `0${minutes}:${seconds}.${milliseconds-minutes*60*1000-seconds*1000}`
        }
        return `${minutes}:${seconds}.${milliseconds-seconds*1000}`
    }

    var loadUrl = (e) => {
        setUrl(inputUrl)
    }

    var handleInputUrl = (e) => setInputUrl(e.target.value)

  return (
    <main className="space-y-12 mx-4 md:mx-24 flex flex-row">
      <section className="mx-4 px-4 border-r-2">
        <div className="flex my-4">
            <input
            className="w-full my-3 rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            type="text"
            placeholder="Paste YouTube URL, example: https://www.youtube.com/watch?v=08nggMRgCFI"
            onChange={handleInputUrl}
            />
            <button
            className="rounded m-3 px-4 bg-violet-400 hover:bg-violet-500"
            onClick={loadUrl}>
                <ArrowDownIcon className="h-6 w-6 font-bold text-white"/>
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
      <section className="mx-4 px-4">
        <section className="my-2">
            <div className="my-4">
                <h2 className="text-2xl py-2">Manual</h2>
                <ol className="list-decimal">
                    {
                        [
                            'Play the video',
                            'Click "capture" to add new breakpoint',
                            'Click play button to start the video from selected breakpoint',
                            'Click trash can button to delete breakpoint or "clear" to delete all breakpoints',
                            'Use player to navigate the video'
                        ].map((text,index) => (
                            <li key={index} className="py-1">
                                {text}
                            </li>
                        ))
                    }
                </ol>
            </div>
        </section>
        <section>
            <button
                className="rounded ml-4 py-2 px-4 bg-transparent border border-indigo-500 text-indigo-500 hover:text-indigo-600"
                onClick={capture}>
                capture
            </button>
            <button
                className="rounded ml-4 py-2 px-4 bg-transparent border text-gray-400 border-gray-400 hover:text-gray-600"
                onClick={clear}>
                clear
            </button>
        </section>
        <hr className="my-7"></hr>
        <section className="mx-4 px-4">
        {breakpoints.map((breakpoint, index) => {
            const time = msToTime(Math.floor(breakpoint.time * 1000));
            return (
                <div key={breakpoint.id} className="flex mx-2 py-1">
                    <p className="text-gray-700 py-2 px-1">{index+1}.</p>
                    <input
                        type="text"
                        placeholder="breakpoint name..."
                        className="font-light py-2 px-4"
                    />
                    <p className="font-light text-gray-400 py-2 px-4">{time}</p>
                    <button
                        className="mx-1 py-2 px-4 border rounded"
                        onClick={playFrom(breakpoint.time)}>
                        <PlayIcon className="h-6 w-6 text-emerald-300 hover:text-emerald-500"/>
                    </button>
                    <button
                        className="mx-1 py-2 px-4 border rounded"
                        onClick={remove(breakpoint.id)}>
                        <TrashIcon className="h-6 w-6 text-gray-400 hover:text-indigo-500"/>
                    </button>
                </div>
            )
        })}
      </section>
      </section>
    </main>
  )
}
