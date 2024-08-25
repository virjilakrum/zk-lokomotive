const styles = theme => ({
    bootstrapFormLabel: {
      fontSize: 18,
      '&:focus': {},
    },
    bootstrapRoot: {
      'label + &': {
        marginTop: theme.spacing.unit * 2.5,
      },
    },
    bootstrapInput: {
      borderRadius: 8,
      backgroundColor: '#b2bec3',
      border: '1px solid #b2bec3',
      fontSize: 10,
      width: '250px',
      padding: '5px 6px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
  })

  export default styles