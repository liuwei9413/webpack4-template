import {fetch} from './axios.js'

export const login = function (params) {
  return fetch('/users/login', 'post', params)
}

export const logout = function (params) {
  return fetch('/users/logout', 'post', params)
}

export const getVersionsList = function (params) {
  let url = `/versions?page=${params.currentPage - 1}&page_size=${params.pageSize}`
  if (params.order !== '') {
    url += `&order=${params.order}`
  }
  if (params.update !== '') {
    url += `&update=${params.update}`
  }
  if (params.platform !== '') {
    url += `&platform=${params.platform}`
  }
  return fetch(url, 'get')
}

export const getLatestVersionInfo = function () {
  return fetch('/versions/latest', 'get')
}

export const addVersion = function (params) {
  return fetch('/versions', 'post', params)
}

export const getVersionInfo = function (id) {
  return fetch(`/versions/${id}`, 'get')
}

export const editVersion = function (params) {
  return fetch(`/versions/${params.id}`, 'post', params)
}