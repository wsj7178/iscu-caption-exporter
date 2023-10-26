import axios from 'axios'

export const iscuAxios = axios.create({
  headers: {
    Cookie: `tongken=${process.env.token}`,
  },
})
