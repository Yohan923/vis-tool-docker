import axios from 'axios';


export function getExample(tool, file, setData, url) {

  fetch('http://localhost:9000/examples/tool/' + tool + '/file/' + file)
  .then(response => response.text())
  .then(data => setData(data))
}


export function uploadTextToServer(tool, text, options, setData, url) {

  console.log(options)
  
  const formData = new FormData();
  formData.append('text', text);
  formData.append('options', JSON.stringify(options));

  axios.post('http://localhost:9000/upload/text/tool/' + tool, formData).then(res => {
      console.log(res)
      setData(res.data)
    })
}

export function getConfigs(setter, url) {
  fetch('http://localhost:9000/configs')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    setter(data)
    console.log(data)
  })
}

