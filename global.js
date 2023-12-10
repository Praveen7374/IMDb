const OMDB_URL_PREFIX='http://www.omdbapi.com/?apikey=ff4920c9&';

const TMDB_URL_PREFIX='https://api.themoviedb.org/3/search/';
const authenticationHeaders={
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZjQyMDYxMzY3MDcwNzQ4NzU4M2VhZDQ2YzcxNmFmMyIsInN1YiI6IjY1NDYxMjYxNmJlYWVhMDE0YjY3ODgxNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Jopv2UC7w1eSE4Mv82PTTRGitv_09cOyUcnO-5oVRPQ' ,
    Accept: 'application/json'
};

const toChange=document.getElementById('to-change');
const inputBox=document.getElementById('input-box');
const searchResult=document.getElementById('search-result');
const list=document.createElement('ul');
const firstSlider=document.getElementById('slider');
const secondSlider=document.getElementById('slider2');
const thirdSlider=document.getElementById('slider3');
const bodyController=document.getElementById('body-controller');


let option='collection';

function trackChange(parameter){
    if(parameter === 'all'){
        option='collection';
        toChange.innerText="All";
    }else if(parameter === 'title'){
        option='movie';
        toChange.innerText='Titl.';
    }else if(parameter === 'episode'){
        option='tv';
        toChange.innerText='Epis.';
    }else if(parameter === 'celebs'){
        option='person';
        toChange.innerText="Cele.";
    }else if(parameter === 'company'){
        option='company';
        toChange.innerText="Comp.";
    }else if(parameter === 'keyword'){
        option='keyword'
        toChange.innerText='Keyw.';
    }else{
        option='multi';
        toChange.innerText='Adva.';
    }
    return;
}

let template=`<li>
    <div class="img">
        <img src="%%link%%">
    </div>
    <div class="content">
        <span class="heading">%%title%%</span>
        <span class="year">%%year%%</span>
        <span class="actor">%%overview%%</span>
    </div>
</li>`;


function request(){
    searchResult.innerHTML='';
    let fullUrl=`${TMDB_URL_PREFIX}movie?query=${inputBox.value}`;
    fetch(fullUrl,{
        headers:authenticationHeaders
    })
    .then((response)=>{
        if(response.ok){
            return response.json();
        }
        throw new Error('Response was not ok');
    })
    .then((jsonResponse)=>{
        if(jsonResponse.results.length>0){
            list.innerHTML=jsonResponse.results.map((element)=>{
            return template.replace('%%link%%',`https://image.tmdb.org/t/p/w500/${element.poster_path}`)
            .replace('%%title%%',element.title)
            .replace('%%year%%',element.release_date)
            .replace('%%overview%%',element.release_date);
        }).join('');
        }
        searchResult.appendChild(list);
    })
    .catch((error)=>{
        console.error(error);
    })
}

function loadSliderData(postUrl,time,slice,domElement,callback){
    let sliderTemplate=`<div class="content">
    <img src="%%link%%" alt="movie image"/>
    <div class="details">
        <div class="rating">
            <div><i class="fa-solid fa-star"></i> %%rating%%</div>
            <div class="margin"><i class="fa-regular fa-star"></i></div>
        </div>
        <div class="title"> %%title%%</div>
        <div class="watch-list-btn"><i class="fa-solid fa-plus"></i> Watchlist</div>
    </div>
</div>`;

fetch(`https://api.themoviedb.org/3/${postUrl}/${time}`,{
    headers:authenticationHeaders
})
.then((response)=>{
    if(response.ok){
        return response.json();
    }
    throw new Error("Response was not ok");
})
.then((jsonResponse)=>{
     domElement.innerHTML=jsonResponse.results.slice(0,slice).map((element,index)=>{
        return sliderTemplate.replace('%%link%%',`https://image.tmdb.org/t/p/w500/${element.poster_path}`)
        .replace('%%rating%%',element.vote_average)
        .replace('%%title%%',`${index+1}. ${element.media_type} `);
     }).join('');
     if(callback) callback();
})
}

document.body.onload=loadSliderData('trending/all','week',7,firstSlider,()=>{
    loadSliderData('/trending/movie','day',7,secondSlider,()=>{
        loadSliderData('/trending/tv','day',7,thirdSlider);
    });
})