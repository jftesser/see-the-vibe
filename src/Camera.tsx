import { FC, useState, useCallback, useMemo, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { getVariant } from "./firebase/firebaseSetup";
import "./Camera.scss";

const Camera: FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [cameradId, setCameraId] = useState<string | null>(null);
    const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [vibeSrc, setVibeSrc] = useState<string | null>(null);
    const [captureSrc, setCaptureSrc] = useState<string | null>(null);
    const [isFlashActive, setIsFlashActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const sz = 512;

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setDeviceList(videoDevices);
        });
    });
    const capture = useCallback(
        async () => {
            if (webcamRef.current) {
                setIsFlashActive(true);
                setIsLoading(true);
                setTimeout(() => setIsFlashActive(false), 200);
                const imageSrc = webcamRef.current.getScreenshot();
                setCaptureSrc(imageSrc);
                if (imageSrc) getVariant(imageSrc.split(',')[1]).then((result) => {
                    console.log('variant', result);
                    setVibeSrc(result.data as string);
                    setCaptureSrc(null);
                    setIsLoading(false);
                });
            }
        },
        [webcamRef]
    );

    const clearVibe = useCallback(() => {
        setVibeSrc(null);
    }, []);

    const config = useMemo(() => {
        if (cameradId) {
            return { deviceId: cameradId, width: sz, height: sz };
        }
        return { width: sz, height: sz };
    }, [cameradId]);

    return (
        <div className="camera">
            {setDeviceList.length ? (<select className="cam-select" onChange={(e) => setCameraId(e.target.value)}>{deviceList.map((device: MediaDeviceInfo) => (<option key={device.deviceId} value={device.deviceId}>{device.label}</option>))}</select>)
                : ''}
            <div className="camera-holder">
                <Webcam
                    className="camera-feed"
                    audio={false}
                    videoConstraints={config}
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    width={sz}
                    height={sz}
                />
                {captureSrc && <div className="vibe-photo camera-feed"><img src={captureSrc} width={sz} height={sz} alt="the camera capture" /></div>}
                <div className="camera-frame" />
                {isLoading && <div className="loading-overlay"><span>Vibing...</span></div>}
                {vibeSrc && <div className="vibe-photo"><img src={vibeSrc} width={sz} height={sz} alt="the vibey camera output" /><button onClick={clearVibe}>X</button></div>}
            </div>
            <button className="cam-button" onClick={capture}></button>
            <div className={`flash-overlay ${isFlashActive ? 'active' : ''}`} />
        </div>
    );
}

export default Camera;