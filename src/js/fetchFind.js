const axios = require('axios').default;
const PER_PAGE = 100;
export default class PhotoClass {
    constructor(){
        this.searchQuery="";
        this.page=1;
        this.totalHits=0;

    }

    async fetchFindImage(){
       const def= axios.create({
            baseURL:'https://pixabay.com/api/',
            url:'',
            params: {
                key: '26721460-a31d9fe7e52cee7d3858c2b4f',
                q: this.searchQuery,
                image_type: 'photo',
                orientation:'horizontal',
                safesearch:'true',
                page:this.page,
                per_page: PER_PAGE,
            },
        });
        try {
            const response = await def.get();
            this.pageIncrease();
            this.totalHits = response.data.totalHits;
            return response;
            } catch(error){
            console.error(error)
        }
    }
    pageIncrease(){
        this.page+=1;
    }
    resetPage(){
        this.page=1;
    }
    get currentPage(){
        return this.page;
    }
    get query(){
        return this.searchQuery
    }
    set query(newQuery){
        this.searchQuery = newQuery
    }
    endPhotoRender() {
        if ((this.page - 1) * PER_PAGE > this.totalHits) {
          return true;
        } else return false;
      }
}