import styled from "styled-components"

const Keys = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
]

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(7, minmax(75px, 1fr));
    gap: 0.5rem;
    width: 600px;

    @media (min-width: 415px) and (max-width: 894px){
        grid-template-columns: repeat(4, minmax(75px, 1fr));
        width: 400px;
    }

    @media(max-width: 414px){
        grid-template-columns: repeat(3, minmax(75px, 1fr));
        width: 300px;
    }
`

const Button = styled.button<{isActive: boolean}>`
    background-color: #0A3871;
    color: #F3F5FC;
    border: none;
    height:30px;
    border-radius:10px ;
    opacity: ${(p) => p.isActive ? 'null':'0.3'};

    &:focus:disabled{
        outline: none;
        border-color: transparent;
        cursor: not-allowed;
    }

    &:focus-visible:disabled{
        outline: none;
        border-color: transparent;
        cursor: not-allowed;
    }

    &:hover:disabled{
        outline: none;
        border-color: transparent;
        cursor: not-allowed;
    }

    @media (max-width: 894px){
        height: 25px;
        font-size: 14px;
    }
`
interface KeyBoardProps {
    disabled?: boolean
    activeLetters: string[]
    inactiveLetters: string[]
    addGuessedLetters: (letter: string) => void
}

export default function Keyboard ({
    disabled= false,
    activeLetters, 
    inactiveLetters,
    addGuessedLetters,
}: KeyBoardProps) {
    return (
         <Wrapper>
            {Keys.map((letter) => {
                const isActive = !activeLetters.includes(letter)
                const isInactive = !inactiveLetters.includes(letter)

                return (
                    <Button 
                        onClick={() => addGuessedLetters(letter)} 
                        isActive={isActive && isInactive} 
                        key={letter}
                        disabled={!(isActive && isInactive) || disabled}
                    >
                        {letter.toUpperCase()}
                    </Button>
                )
            })}
        </Wrapper>
    )
}