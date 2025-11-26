import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 30,
  },
  inputGroup: { marginBottom: 14 },
  label: { color: '#fff', fontSize: 14, marginBottom: 6, marginLeft: 6 },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 9,
    marginVertical: 12,
    alignItems: 'center',
  },
  redButton: { backgroundColor: '#db3022' },
  whiteButton: { backgroundColor: '#fff' },
  buttonText: { fontSize: 18 },
  whiteText: { color: '#fff' },
  redText: { color: '#db3022' },
  toggleText: { color: '#fff', fontSize: 15, textAlign: 'center' },
  toggleLink: { fontWeight: 'bold', color: '#db3022' },
  forgotText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default styles;