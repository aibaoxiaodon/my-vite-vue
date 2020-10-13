import { ref, onMounted, onUnmounted } from 'vue'

function useSlipBy () {
    const x = ref(0)
    const y = ref(0)

    function upload (e: any) {
        x.value = e.pageX
        y.value = e.pageY
        
    }

    onMounted(() => {
        window.addEventListener('mousemove', upload)
    })

    onUnmounted(() => {
        window.addEventListener('mousemove', upload)
    })

    return { x, y }
}

export default useSlipBy