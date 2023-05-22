import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";

import Section from './index.jsx'
import Typography from '../Typography/index.jsx'
import Button from '../Button/index.jsx'

import lottie from "lottie-web";

const SSection = styled(Section)`
    padding-bottom: 80px;
    padding-top: 0;
    // @media (max-width: 680px) {
    //     h2 {
    //         margin-top: 100px;
    //     }
    // }
    .Content {
        position: relative;
    }
    .content--center{
        width: 100%;
    }
`

const ImageContainer = styled.div`
    max-width: 780px;
    width: 100%;
    min-height: 100px;
    position: relative;
    display: flex;
    justify-content: center;
    svg.yellowBallBackground {
        width: 100%;
        max-width: 680px;
    }
`

const Animation = styled.div`
    ${props => props.animationCss}
`

const Subtext = styled(Typography)`
    max-width: 640px;
`

const Badge = styled.img`
  height: auto;
  max-width: 100%;
  width: 220px;
  position: initial;
  margin-top: 6px;
  @media (min-width: 750px) {
    right: 6px;
    position: absolute;
  }
`

function Section1(props) {

    const animationLoaded = useRef(false);
    useEffect(() => {
        // check to prevent double animation load on page remount
        if (!animationLoaded.current && props.animation) {
            lottie.loadAnimation({
                container: document.querySelector(`#derp-animation`),
                animationData: props.animation,
            });
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
        animationLoaded.current = true;
    }, []);



    return (
        <SSection
            id={'Section1'}
            gradient
            center
        >
            <ImageContainer 
                className="ImageContainer"
            >
                {
                    props.yellowBallBackground && 
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 100 50"
                        className="yellowBallBackground"
                    >
                        <circle cx="50" cy="-8" r="50" fill="#FFFFA0" />
                    </svg>
                }


                <Animation 
                    id='derp-animation' 
                    animationCss={props.animationCss}
                />
            </ImageContainer>
            <div style={{width: '100%'}}>
            <Typography type="h2" center fullWidth>
                {props.title}
            </Typography>
            </div>
            {
                props.theGraphBadge &&
                <Badge
                    src='../assets/icons/Badge_PoweredByTheGraph_white.svg'
                />
            }

            {/* 
            <Subtext center>
                Add the DERP RPC endpoint to your crypto wallet to see exactly what information is being leaked about you every time you connect to a crypto service.
            </Subtext>

            <Button
                hopr
                onClick={props.setShowSetup}
            >
                SETUP
            </Button> */}


        </SSection>
    );
}

export default Section1;
