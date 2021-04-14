export const TOOLS = {
    default: 'pifra',
    pifra: 'pifra',
    symbisim: 'symbisim'
}

export const TOOLS_CONFIG = {
    pifra: {
        examples: ['fresh.pi', 'gen-fresh-a.pi'],
        parameters: {
            required: {
                maxStates: {
                    label: 'Max number of states',
                    default: 20,
                    presets: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
                    info: 'maximum number of states explored (default 20)',
                    type: 'integer',
                    allowUserInput: true,
                    input: true
                }

            },
            optional: {
                maxStates: {
                    label: 'Max number of states',
                    default: 20,
                    presets: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
                    info: 'maximum number of states explored (default 20)',
                    type: 'integer',
                    allowUserInput: true,
                    input: true
                },
                maxRegisters: {
                    label: 'Max number of registers',
                    default: 0,
                    presets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    info: 'maximum number of registers (default is unlimited)',
                    type: 'integer',
                    allowUserInput: true,
                    input: true
                }
            }
        }
    },
    symbisim: {
        examples: [],
        parameters: {
            required: {
                maxStatess: {
                    label: 'Max number of states',
                    default: 2,
                    presets: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
                    info: 'maximum number of states explored (default 20)',
                    type: 'integer',
                    allowUserInput: true,
                    input: true
                }

            },
            optional: {
                maxRegisterss: {
                    label: 'Max number of registers',
                    default: 4,
                    presets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    info: 'maximum number of registers (default is unlimited)',
                    type: 'integer',
                    allowUserInput: true,
                    input: true
                }
            }
        }
    }
}