import { Avatar } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useRef, useState } from "react"
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile: React.FunctionComponent = (): JSX.Element => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore()
  const [firstName, setfirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [image, setImage] = useState<null | string>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [selectedColor, setSeletedColor] = useState<number|string>(0);
  const fileInputRef=useRef<HTMLInputElement>(null)

  useEffect(()=>{
    if(userInfo?.profileSetup){
      setfirstName(userInfo?.firstName);
      setLastName(userInfo.lastName);
      setSeletedColor(userInfo?.color)
    }
    if(userInfo?.image){
      setImage(`${HOST}/${userInfo.image}`)
    }
  },[userInfo])


  const validateProfile=()=>{
    if(!firstName){
      toast.error("First name is required");
      return false
    }
    if(!lastName){
      toast.error("Last name is required");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try {
        const resonse=await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true});

        if(resonse.status==200 && resonse.data){
          setUserInfo({...resonse.data});
          toast.success("Profile updated successfully.")
          navigate("/chat")
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleNavigate=()=>{
    if(userInfo?.profileSetup){
      navigate("/chat")
    }else{
      toast.error("Please setup Profile")
    }
  }

  const handleFileInputClick=()=>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  }

  const handleImageChange=async(event:any)=>{
      const file=event.target.files[0];
      console.log("Files:",event.target.files[0])
      if(file){
        const formData= new FormData();
        formData.append("profile-image",file);
        const response=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
        if(response.status===200&&response.data.image){
          if(userInfo){
            setUserInfo({
              ...userInfo,
              image: response?.data?.image
            });
            toast.success('Image uploaded successfully')
          }

          // const reader=new FileReader();
          // reader.onload=()=>{
          //   setImage(reader.result as string | null);
          // }
          // reader.readAsDataURL(file)
        }
      }
  }

  const handleDeleteImage=async()=>{
   try {
    const response=await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true})
    if(response.status===200){
      if(userInfo){
        setUserInfo({...userInfo,image:null});
        toast.success("Image removed successfully");
        setImage(null);
      }
    }
   } catch (error) {
    console.log(error)
   }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate} role="button">
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative items-center flex justify-center"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? <AvatarImage src={image} className="object-cover w-full h-full bg-black" /> 
              : <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                {firstName ? firstName.split("").shift() : userInfo?.email?.split("")?.shift()}
              </div>}
            </Avatar>
            {
              hover&&(
                <div onClick={image?handleDeleteImage:handleFileInputClick} className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
                  {
                    image?<FaTrash className="text-white text-3xl cursor-pointer"/>:<FaPlus className="text-white text-3xl cursor-pointer"/>
                  }
                </div>
              )
            }
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange}  name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp"/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
               <div className="w-full">
                <Input placeholder="email" type="email" disabled value={userInfo?.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
               </div>
               <div className="w-full">
                <Input placeholder="First Name" type="text" onChange={(e)=>setfirstName(e.target.value)} value={firstName} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
               </div>
               <div className="w-full">
                <Input placeholder="Last Name" type="text" onChange={(e)=>setLastName(e.target.value)} value={lastName} className="rounded-lg p-6 bg-[#2c2e3b] border-none"/>
               </div>
               <div className="w-full flex gap-5">
                  {
                    colors.map((color:any,index:any)=>(<div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 
                    ${selectedColor===index?'outline outline-white/50 outline-1':''}`} key={index} onClick={()=>setSeletedColor(index)}>
                     
                    </div>))
                  }
               </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile