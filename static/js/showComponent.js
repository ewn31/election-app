async function showComponent(url, method='GET', body={}, target, loader, f){
    if(method !== 'GET'){var response = await fetch(url, {method: method, body:body});}
    else{var response = await fetch(url)}
    const container = document.getElementById(target)
    container.innerHTML = loader;
    if(!response.ok)return container.innerHTML = `${response.status}, request failed`;
    let data = await response.json();
    if(data){
        var template = f(data);
        container.innerHTML = template
    }else{
        container.innerHTML = 'Error'
    }
    
    }
    