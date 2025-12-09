export default function CounterTaskWidget({title, desc, count}){
    return (
       <>
          <div className="bg-primary flex h-30 w-45 flex-col items-center justify-center rounded-xl px-5 py-3 gap-3">
            <div className="flex flex-col justify-center items-center">
             <h1 className="text-accent text-xl font-semibold">{title}</h1>
             <h1 className="text-accent text-base font-normal">{desc}</h1>
            </div>
             <div className="bg-card h-fit w-fit rounded-lg px-4 py-2">
                <h1 className="text-primary text-4xl font-semibold">{count}</h1>
             </div>
          </div>
       </>
    );
}