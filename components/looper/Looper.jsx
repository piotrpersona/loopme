import React from 'react'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid';
import Image from 'next/image';
import { ArrowDownIcon, CheckIcon, DocumentDuplicateIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/solid'
import hash from "object-hash";

const LOCAL_STORAGE_SAVE_KEY = "loopme.saved"
const MAX_BREAKPOINTS = 20

export default function Looper() {
    var ref = React.createRef()

    const [url, setUrl] = useState('https://www.youtube.com/watch?v=08nggMRgCFI')
    const [inputUrl, setInputUrl] = useState('')
    const [shareUrl, setShareUrl] = useState('')
    const [breakpoints, setBreakpoints] = useState([])
    const [player, setPlayer] = useState(null)
    const [domLoaded, setDomLoaded] = useState(false)
    const [copied, setCopied] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        setDomLoaded(true);
        let params = (new URL(document.location.href)).searchParams;
        const qUrl = params.get('url')
        if (qUrl !== null) {
            setUrl(qUrl)
        }
        const qBreakpoints = params.get('breakpoints')
        if (qBreakpoints !== null) {
            const loadedBreakpoints = qBreakpoints.split(',').map(bstr => {
                var splitted = bstr.split('-')
                return {
                    id: uuid(),
                    name: splitted[0],
                    time: splitted[1]
                }
            })
            setBreakpoints(loadedBreakpoints)
        }
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
            name: '',
        }
        setBreakpoints((prev) => [...prev, breakpoint])
        setCopied(false)
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
            setCopied(false)
        }
    }

    var clear = (e) => {
        setBreakpoints([])
        setCopied(false)
    }

    var msToTime = milliseconds => {
        return new Date(milliseconds).toISOString().slice(14, -1); 
    }

    var loadUrl = (e) => {
        setUrl(inputUrl)
        setBreakpoints([])
        setCopied(false)
    }

    var setBreakpointName = (id) => {
        return (e) => {
            const index = breakpoints.findIndex(obj => obj.id == id)
            breakpoints[index].name = e.target.value
            setBreakpoints(breakpoints)
            setCopied(false)
        }
    }

    var share = (e) => {
        var params = {
            url: url,
            breakpoints: breakpoints.map(b => `${b.name}-${b.time}`).join(','),
        }
        const query = new URLSearchParams(params);
        const shareUrl = `${window.location.origin}/?${query.toString()}`
        navigator.clipboard.writeText(shareUrl)
        setShareUrl(shareUrl)
        setCopied(true)
    }

    var handleInputUrl = (e) => {
        setInputUrl(e.target.value)
    }

    var getSaved = () => {
        var saved = {}
        var storageSaved = localStorage.getItem(LOCAL_STORAGE_SAVE_KEY)
        if (storageSaved !== null) {
            saved = JSON.parse(storageSaved)
        }
        return saved
    }

    var save = (e) => {
        var data = {
            url: url,
            breakpoints: breakpoints.map(b => {
                return {
                    time: b.time,
                    name: b.name
                }
            })
        }
        var saved = getSaved()
        saved[hash(data)] = data
        localStorage.setItem(LOCAL_STORAGE_SAVE_KEY, JSON.stringify(saved));
    }

    var browse = (e) => {
        var saved = getSaved()
        console.log(saved)
    }

  return (
    <main className="space-y-12 mx-4 md:mx-24 flex flex-row">
      <section className="mx-4 mt-8 px-4 border-r-2">
        <h2 className="text-2xl">Paste YouTube URL</h2>
        <div className="flex my-4">
            <input
            className="w-full my-3 rounded-md border border-[#e0e0e0] py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            type="text"
            defaultValue="https://www.youtube.com/watch?v=08nggMRgCFI"
            placeholder="paste URL here..."
            onChange={handleInputUrl}
            />
            <button
            className="rounded m-3 px-4 bg-sky-300 hover:bg-sky-400"
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
      <section className="mx-4 mt-8 px-4">
        <section className="">
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
        </section>
        <hr className="my-7"></hr>
        <section className="my-2">
            <div>
                <button
                    className="rounded mx-2 py-2 px-4 bg-transparent border border-indigo-500 text-indigo-500 hover:text-indigo-600"
                    onClick={capture}>
                    capture
                </button>
                <button
                    className="rounded mx-2 py-2 px-4 bg-transparent border text-gray-400 border-gray-400 hover:text-gray-600"
                    onClick={clear}>
                    clear
                </button>
                <button
                    className="rounded mx-2 py-2 px-4 bg-transparent border text-sky-400 border-sky-400 hover:border-sky-500 hover:text-sky-500 focus:bg-sky-500 focus:text-white"
                    onClick={share}>
                    {copied ? 'copied to clipboard!' : 'share'}
                </button>
                <button
                    className="rounded mx-2 py-2 px-4 bg-transparent border text-indigo-400 border-indigo-400 hover:border-indigo-500 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white"
                    onClick={save}>
                    {saved ? 'saved' : 'save'}
                </button>
                <button
                    className="rounded mx-2 py-2 px-4 bg-transparent border text-indigo-400 border-indigo-400 hover:border-indigo-500 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white"
                    onClick={browse}>
                    browse saved
                </button>
            </div>
            {copied && (
            <div className="m-2 flex">
                <input className="font-light text-gray-500 py-2 px-4 border border-sky-300 rounded-l" type="text" value={shareUrl}/>
                <button
                    className="rounded-r py-2 px-4 bg-sky-300 border border-sky-300 bg-sky-300 hover:border-sky-400 hover:bg-sky-400"
                    onClick={share}>
                    {copied ? <CheckIcon className="h-6 w-6 text-white"/> : <DocumentDuplicateIcon className="h-6 w-6 text-white" />}
                </button>
            </div>
            )}
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
                        defaultValue={breakpoint.name}
                        onChange={setBreakpointName(breakpoint.id)}
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
