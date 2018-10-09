export class Util {
    static cleanUpModules(module) {
        if(module.tutorials) {
            if(module.tutorials.length>0 && module.tutorials[0] == undefined) {
              module.tutorials = [];
            }
          }
          if(module.videos) {
            if(module.videos.length>0 && module.videos[0] == undefined) {
              module.videos = [];
            }
          }
          if(module.urls) {
            if(module.urls.length>0 && module.urls[0] == undefined) {
              module.urls = [];
            }
          }
          return module;
    }
}