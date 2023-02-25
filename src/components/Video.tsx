import { VideoHTMLAttributes, useEffect, useRef, useState } from 'react'
import { FaCamera, FaCaretLeft } from 'react-icons/fa'
import axios from 'axios'
import BASE_URL from '../../config/baseUrl'

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream,
  isOpen: Boolean,
  openCamera: any,
}

function Video({ srcObject, isOpen, openCamera, ...props }: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null)
  const refCanvas = useRef<HTMLCanvasElement>(null)

  const [imageActive, setImageActive] = useState(false);
  const [currentImg, setCurrentImg] = useState('');

  useEffect(() => {
    if (!refVideo.current) {
      const tracks = srcObject.getTracks();

      tracks.forEach(track => {
        track.stop();
      })
      return;
    }
    if(!isOpen || imageActive) {
      const tracks = srcObject.getTracks();

      tracks.forEach(track => {
        track.stop();
      })

      refVideo.current.srcObject = null;
    }
    refVideo.current.srcObject = srcObject
  }, [srcObject, isOpen, imageActive])

  const capture = () => {
    if (!refVideo.current || !refCanvas.current) return
    const width = refVideo.current.offsetWidth;
    const height = refVideo.current.offsetHeight;
    const context = refCanvas.current.getContext('2d');
    refCanvas.current.width = width;
    refCanvas.current.height = height;
    if(width !== undefined && height !== undefined) {
      context?.drawImage(refVideo?.current, 0, 0);
      const data:string = refCanvas.current.toDataURL("image/png");
      context?.clearRect(0, 0, width, height);
      const formData = new FormData();
      formData.append('file', data)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      closeCamAndOpenImage();
      setCurrentImg(data)
      axios.post(`${BASE_URL}/get-calorie`, formData, config).then((res) => {
      }).catch((err) => {
        console.log(err)
      })
      // const url = window.URL.createObjectURL(data);
      // console.log(url);
    }
  }

  const closeImageAndOpenCam = () => {
    setImageActive(false);
    openCamera();
  }

  const closeCamAndOpenImage = () => {
    setImageActive(true);
  }

  if(imageActive) {
    return (
      <div className='h-full w-full bg-white'>
        <div className='flex items-center justify-between py-5 px-4'>
          <div>
            <FaCaretLeft size={24} className="cursor-pointer" onClick={closeImageAndOpenCam} />
          </div>
          <div style={{paddingRight: "20px"}}>
            <p className='font-bold'>Apple</p>
          </div>
          <div></div>
        </div>
        <div className='h-full px-6'>
          <div className='flex items-center justify-center'>
            <img src={currentImg || ''} alt="identified-food" width="50%" className='rounded-lg' />
          </div>
          <div className='border my-4 p-4 rounded-lg'>
            <p className='text-sm'>No food recognized</p>
          </div>
          {/* <div className='py-4'>
            <div>
              <p>Suggested Diet Plan's</p>
              <div>

              </div>
            </div>
          </div> */}
        </div>
      </div>
    )
  }

  return (
    <>
      <video ref={refVideo} {...props} className="rounded-lg" />
      <div className='absolute w-full bg-opacity-40 bg-black bottom-0 px-4 py-4'>
        <div className='flex items-center'>
          <div className='mx-auto'>
            <div className="bg-gray-800 w-12 h-12 flex items-center justify-center rounded-[50%] cursor-pointer" onClick={capture}>
              <FaCamera color='white' size={20} />
            </div>
          </div>
        </div>
      </div>
      <canvas className='absolute -z-10' ref={refCanvas}></canvas>
    </>
  )
}

export default Video;