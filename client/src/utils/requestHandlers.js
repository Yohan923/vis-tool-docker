import axios from 'axios';
import {SERVER_ADDRESS} from '../consts/app'


export function getExample(tool, file, setData, url) {

  fetch(SERVER_ADDRESS + '/examples/tool/' + tool + '/file/' + file)
  .then(response => response.text())
  .then(data => setData(data))
}


export function uploadTextToServer(tool, text, options, setData, url) {

  console.log(options)
  
  const formData = new FormData();
  formData.append('text', text);
  formData.append('options', JSON.stringify(options));

  axios.post(SERVER_ADDRESS + '/upload/text/tool/' + tool, formData).then(res => {
      console.log(res)
      setData(res.data)
    })
}

export function getConfigs(responseHandler, url) {
  fetch(SERVER_ADDRESS + '/configs')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    responseHandler(data)
    console.log(data)
  })
}

