/// <reference types="vite/client"></reference>


interface ImportMetaEnv {
    readonly VITE_API_URL;
    readonly VITE_CHAT_URL;
}


interface ImportMeta {
    readonly env: ImportMetaEnv
}