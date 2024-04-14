let LOCAL = false;

let HostName, URI;

if(LOCAL){
    URI = "mongodb://localhost/contacts";
    HostName = "localhost";
}else{
    HostName = "Mongo DB Atlas";
    URI= "mongodb+srv://larai:PrJLGIIWOYrmuI21@cluster0.rdvvcir.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0"
}

export { HostName, URI }
export const SessionSecret = "INFT2202SessionSecret";

//larai
//PrJLGIIWOYrmuI21


