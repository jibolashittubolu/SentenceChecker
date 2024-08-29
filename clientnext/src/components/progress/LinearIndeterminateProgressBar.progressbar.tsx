const LinearIndeterminateProgressBar = () => {
  return (
    <>
    <style jsx>{`
        {/* body {
            // background-color: red;
            // display: none;
            margin: 0;
            padding: 25px;
        }
         */}
        .emitter{
            {/* background-color: pink; */}
            width: 100%;
            height: 4px;
            {/* height:auto; */}
            {/* min-height:4px; */}
            {/* height: 4px; */}
            display: flex;
            align-items: center;
            justify-content: center;

        }
        .demo-container {
            // background-color: red;
            {/* min-height: ; */}

            height: 100%;
            width: 100%;
            margin: auto;
        }
        
        .progress-bar {
            height: 4px;
            height: 100%;
            background-color: rgba(5, 114, 206, 0.2);
            width: 100%;
            overflow: hidden;
        }
        
        .progress-bar-value {
            width: 100%;
            height: 100%;
            background-color: rgb(5, 114, 206);
            animation: indeterminateAnimation 5s infinite linear;
            transform-origin: 0% 50%;
        }
        
        @keyframes indeterminateAnimation {
            0% {
            transform:  translateX(0) scaleX(0);
            }
            40% {
            transform:  translateX(0) scaleX(0.4);
            }
            100% {
            transform:  translateX(100%) scaleX(0.5);
            }
        }
    `}</style>
    <div className="emitter">

        <div className="demo-container">
            <div className="progress-bar">
                <div className="progress-bar-value"></div>
            </div>
        </div>
    </div>
    </>
  )
}

export default LinearIndeterminateProgressBar