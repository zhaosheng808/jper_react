/**
 * Created by DELL on 2017/12/27.
 */
/*
* 项目所有api在此处
* 引入方式：
* 1. import api from '@/api'
* 2. pi.login
* */
const base_url = 'http://upload.newscctv.net:8090/';
export default {
  login_liveCut: 'https://upload.newscctv.net:1443/ovesystem_1_4/login.php',
  importLiveMaterial: base_url + 'ovesystem_1_4/newscctvExportLive.php',
  materialInfo: base_url + 'ovesystem_1_4/materialInfo.php'
}