class LinkCard {

    static newInstance() {
        return new LinkCard();
    }

    render(data) {
        this._linkCard = document.createElement("div");
        this._linkCard.innerHTML = this.#getTemplate(data);
        this._linkCard = this._linkCard.firstElementChild;
        return this._linkCard;
    }

    #getTemplate(data) {
        return `
        <div data-lc-id="${Object.getOwnPropertyDescriptor(data, "_id").value}" tabindex="0"
             class="relative flex gap-x-4 px-4 sm:px-6 py-4 sm:py-5 w-full min-w-[350px] bg-white border border-slate-200 rounded-xl transition-shadow hover:shadow-card select-none">
            <img alt="icon" onload="this.style.opacity=1"
                 class="size-6 object-fill border border-slate-300 rounded-full hidden sm:inline-block opacity-0 transition-opacity duration-300"
                 src="https://cdn.shortnx.in/images/icons/?url=${data.originalUrl}"/>
        
            <div class="flex-1 flex flex-col gap-1.5 overflow-hidden">
                <h3 class="self-start truncate text-[15px] font-medium text-textPrimary">
                    ${data.title || `shortnx.in/${data.shortUrlId}`}
                </h3>
                <div class="flex items-center text-[13px] text-textSecondary/60 gap-1 w-full overflow-hidden">
                    <i class="icon-arrow-undo-down-right flex-shrink-0"></i>
                    <div class="flex items-center min-w-0 overflow-hidden">
                        <a 
                           class="truncate font-normal transition-colors hover:underline hover:underline-offset-2 hover:text-textSecondary min-w-0"
                           href="${data.originalUrl}" target="_blank">
                           ${data.originalUrl.replace(/^https?:\/\//, "")}
                        </a>
                        <span class="flex items-center flex-shrink-0 whitespace-nowrap pl-2">
                            <i class="pr-2">•</i><span>${new Date(data.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })}</span>
                        </span>
                    </div>
                </div>
            </div>
        
            <div class="self-start flex items-center gap-3 text-textSecondary flex-shrink-0">
                <button class="flex justify-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-200 rounded-md hover:bg-neutral-100/80">
                    <svg class="self-baseline" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1"
                         viewBox="0 0 24 24" width="11" height="11" fill="#306ef2">
                        <path d="M12,24c-1.65,0-3-1.35-3-3V3c0-1.65,1.35-3,3-3s3,1.35,3,3V21c0,1.65-1.35,3-3,3Zm9,0c-1.65,0-3-1.35-3-3V9c0-1.65,1.35-3,3-3s3,1.35,3,3v12c0,1.65-1.35,3-3,3Zm-18,0c-1.65,0-3-1.35-3-3v-6c0-1.65,1.35-3,3-3s3,1.35,3,3v6c0,1.65-1.35,3-3,3Z"/>
                    </svg>
                    <span class="self-baseline"><span class="me-1">${data.clicks}</span><span class="hidden sm:inline-block">clicks</span></span>
                </button>
                <button class="icon-copy-alt p-2 border border-slate-200 rounded-md hover:bg-neutral-100/80"></button>
                <button data-lc-btn-menu class="icon-more-vertical text-[18px]"></button>
            </div>
        
        </div>`;
    }




}

export default LinkCard;