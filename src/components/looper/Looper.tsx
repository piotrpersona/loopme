import React from 'react'
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid';

const MAX_BREAKPOINTS = 12

export default function Looper() {
    var ref = React.createRef(null)

    const [url, setUrl] = useState('https://www.youtube.com/watch?v=08nggMRgCFI')
    const [inputUrl, setInputUrl] = useState('')
    const [breakpoints, setBreakpoints] = useState([])
    const [player, setPlayer] = useState(null)

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

    var set = time => {
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
    <main>
      <input type="text" onChange={handleInputUrl}/>
      <button onClick={loadUrl}>load</button>
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
      <button onClick={capture}>capture</button>
      <button onClick={clear}>clear</button>
      <div>
        {breakpoints.map(breakpoint => {
            const time = msToTime(Math.floor(breakpoint.time * 1000));
            return (
                <div key={breakpoint.id}>
                <p>{time}</p>
                <button onClick={set(breakpoint.time)}>set</button>
                <button onClick={remove(breakpoint.id)}>remove</button>
            </div>
            )
        })}
      </div>
    </main>
  )
}
