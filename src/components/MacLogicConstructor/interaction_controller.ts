import { Input, RunnableInteraction, PossibleUserInput, Undo, Redo, ForgetfulUndo, run_interaction } from 'coastline/src/interaction/interaction';

export class InteractionController<State, UserInput> {
    private generator: Generator<State, State, PossibleUserInput<UserInput>>
    private it: IteratorResult<State, State>
    public state: State

    constructor(readonly interaction: RunnableInteraction<State, UserInput>) {
        this.generator = run_interaction(this.interaction)
        this.it = this.generator.next()
        this.state = this.it.value
    }

    step(input: UserInput): State {
        this.it = this.generator.next(Input(input))
        this.state = this.it.value
        // console.log(this.state)
        return this.state
    }

    undo(): State {
        this.it = this.generator.next(Undo)
        this.state = this.it.value
        return this.state
    }

    redo(): State {
        this.it = this.generator.next(Redo)
        this.state = this.it.value
        return this.state
    }

    forgetful_undo(): State {
        this.it = this.generator.next(ForgetfulUndo)
        this.state = this.it.value
        return this.state
    }

    restart(): State {
        this.generator = run_interaction(this.interaction)
        this.it = this.generator.next()
        this.it = this.generator.next()
        this.state = this.it.value
        return this.state
    }
}