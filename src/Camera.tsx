import { FC, useState, useCallback, useMemo, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { getVariant } from "./firebase/firebaseSetup";

const Camera: FC = () => {
    const webcamRef = useRef<Webcam>(null);
    const [cameradId, setCameraId] = useState<string | null>(null);
    const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
    const [vibeSrc, setVibeSrc] = useState<string | null>(null);
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
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) getVariant(imageSrc.split(',')[1]).then((result) => { console.log('variant', result); });
            }
        },
        [webcamRef]
    );

    // Use useCallback to avoid unexpected behaviour while rerendering
    const onError = useCallback((error: any) => { console.log(error) }, []);

    // Use useMemo to avoid unexpected behaviour while rerendering
    const config = useMemo(() => {
        if (cameradId) {
            return { deviceId: cameradId, width: sz, height: sz };
        }
        console.log('configuring camera');
        return { width: sz, height: sz };
    }, [cameradId]);
    return (
        <div className="camera">
            <h1>camera</h1>
            {setDeviceList.length ? (<select onChange={(e) => setCameraId(e.target.value)}>{deviceList.map((device: MediaDeviceInfo) => (<option key={device.deviceId} value={device.deviceId}>{device.label}</option>))}</select>)
                : ''}
            <Webcam
                audio={false}
                videoConstraints={config}
                ref={webcamRef}
                screenshotFormat="image/png"
                width={sz}
                height={sz}
            />
            <button onClick={capture}>Capture photo</button>
        </div>
    );
}

export default Camera;