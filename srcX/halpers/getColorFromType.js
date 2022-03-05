export default (type) => {
    switch (type) {
        case 'toilet':
            return '#9EC3E5';

        case 'bar':
            return '#ADB4BD';

        case 'wearable':
            return '#E38FBC';

        case 'parking':
            return '#A0D892';
        
        case 'ticket':
            return '#FBCF9C';
    
        default:
            return '#fff';
    }
}