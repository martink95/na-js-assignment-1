
export const getLaptopInformation = async() => {
    const response = await (await fetch("https://noroff-komputer-store-api.herokuapp.com/computers")).json();
    return await response;
} 