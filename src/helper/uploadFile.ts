import axios from "axios";

const url = `https://api.cloudinary.com/v1_1/dvh2rphf4/image/upload`

const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append("upload_preset", "er7f9nks")

    const response = await axios.post(
        url, formData
    );
    return response.data.secure_url;
}

export default uploadFile