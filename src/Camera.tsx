import { FC, useState, useCallback, useMemo, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { getVariant } from "./firebase/firebaseSetup";
import "./Camera.scss";

const Camera: FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [cameradId, setCameraId] = useState<string | null>(null);
    const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [vibeSrc, setVibeSrc] = useState<string | null>(null);
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
                if (imageSrc) getVariant(imageSrc.split(',')[1]).then((result) => {
                    console.log('variant', result);
                    setVibeSrc(result.data as string);
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
                {isLoading && <div className="loading-overlay"><span>Generating...</span></div>}
                {vibeSrc && <div className="vibe-photo"><img src={vibeSrc} width={sz} height={sz} alt="the vibey camera output" /><button onClick={clearVibe}>X</button></div>}
            </div>
            <button className="cam-button" onClick={capture}></button>
            <div className={`flash-overlay ${isFlashActive ? 'active' : ''}`} />
            <svg xmlns="http://www.w3.org/2000/svg">
                <filter id="camFilter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
                    <feMorphology operator="dilate" radius="15 15" x="0" y="0" width="100vw" height="100vw" in="SourceGraphic" result="morphology" />
                    <feDisplacementMap in="morphology" in2="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100vw" height="100vw" result="displacementMap1" />
                </filter>
            </svg>
        </div>
    );
}

export default Camera;