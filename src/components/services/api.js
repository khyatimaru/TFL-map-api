export default async function getRequest(URL){
    const apiURL = await
    fetch(URL);
    const data = await apiURL.json();
    console.log(data);
    return data;
}