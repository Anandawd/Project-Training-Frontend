import {Options, Vue} from 'vue-class-component';
import {v4 as uuidv4} from 'uuid';

@Options({
    name: 'app-input',
    props: {
        modelValue: String,
        icon: String,
        type: String,
        inline: Boolean,
        label: String,
        placeholder: String,
        autocomplete: String,
        successMessage: String,  
        name: {
            type: String,
            required: true
        },
        
    },
    emits: ['update:modelValue']
})
export default class Input extends Vue {
    private ID: string = uuidv4();
    private modelValue: string;
    private icon: string;
    private type: string;
    private placeholder: string;
    private autocomplete: string;
    private errorMessage: string;
    private meta: string;

    public onValueChange(event: any) {
        this.$emit('update:modelValue', event.target.value);
    }
    
}
