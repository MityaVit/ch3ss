export const MoveButton = ({ orientation, status, onClick }) => {
    return (
        <div
            onClick={status === "active" ? onClick : null}
            className={`
                ${status === "active" ? "bg-[#434343] group cursor-pointer hover:bg-[#555555]" : "bg-[#333232] cursor-auto"}
                w-20
                h-10
                sm:w-44
                flex
                items-center
                justify-center
                select-none
            `}
        >
            <img
                src={`icons/buttons/arrow_${orientation}_${status}.svg`}
                alt={`${orientation} ${status} arrow`}
                className="w-[1.65vw] h-[3.33vh]"
                draggable="false"
            />
        </div>
    );
};